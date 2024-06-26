

import { StreamingTextResponse, LangChainAdapter } from "ai";
import { LangChainStream } from "langchain";

import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { CallbackManager, LangChainTracerV1 } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextResponse } from "next/server";
import { MemoryManager } from "@/lib/memoryservice";
import { ratelimit } from "@/lib/rate-limit";
import prisma from "@/lib/prismadb";

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();
    const { userId } = auth();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = `${request.url}-${user.id}`;
    const { success } = await ratelimit(identifier);

    if (!success) {
      return new NextResponse("Rate Limit exceeded", { status: 429 });
    }

    const companion = await prisma.companion.update({
      where: {
        id: params.chatId,
        // userId: user.id, // Uncomment if you want only the user who created the chat to update it
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    const name = companion.id;
    const companion_file_name = `${name}.txt`;

    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama-2-13b",
    };

    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readLatestHistory(companionKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }

    await memoryManager.writeToHistory(`User: ${prompt}\n`, companionKey);
    const recentChatHistory = await memoryManager.readLatestHistory(companionKey);
    const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name);

    let relevantHistory = "";
    if (similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    try {
      const { handlers } = LangChainStream();
      // Use handlers in your code
    } catch (error) {
      console.error("Error while initializing LangChainStream:", error);
      // Handle the error appropriately
    }
    const model = new Replicate({
       model: "lucataco/llama-2-13b-chat:18f253bfce9f33fe67ba4f659232c509fbdfb5025e5dbe6027f72eeb91c8624b",
       input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;

    const resp = String(
      await model
        .call(
          `
          ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.
          ${companion.instruction}
          Below are the relevant details about ${name}'s past and the conversation you are in.
          ${relevantHistory}
          ${recentChatHistory}\n${name}:
          `
        )
        .catch(console.error)
    );

    const cleaned = resp.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const response = chunks[0];

    await memoryManager.writeToHistory(`${response.trim()}`, companionKey);

    const Readable = require("stream").Readable;
    let s = new Readable();
    s.push(response);
    s.push(null);

    if (response !== undefined && response.length > 1) {
      await memoryManager.writeToHistory(`${response.trim()}`, companionKey);

      await prisma.companion.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);

  } catch (error) {
    console.error("ChatPost", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
