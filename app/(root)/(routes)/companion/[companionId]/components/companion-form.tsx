"use client";
import * as z from "zod";
import axios from "axios";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpLoad from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    instruction: z.string().min(200, {
        message: "Instruction requires at least 200 characters.",
    }),
    seed: z.string().min(200, {
        message: "Seed requires at least 200 characters.",
    }),
    src: z.string().min(1, {
        message: "Image is required.",
    }),
    categoryId: z.string().min(1, {
        message: "Category is required.",
    }),
});

const CompanionForms = ({
    categories,
    initialData
}: CompanionFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instruction: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                // Update companion
                await axios.patch(`/api/companion/${initialData.id}`, values);
            } else {
                // Create companion
                await axios.post("/api/companion", values);
            }
            toast({
                description: "Success.",
            });

            router.refresh();
            router.push("/");
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong",
            });
        }
    };

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-18">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">General Information</h3>
                            <p className="text-sm text-muted-foreground">General information about your kid's AI mentor</p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="src"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4">
                                <FormControl>
                                    <ImageUpLoad disabled={isLoading} onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Mickey Mouse"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>This is how the AI mentor will be named.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Little cartoon to help out your little genius"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Short description for the AI mentor.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="categoryId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Select the category to which the AI mentor belongs.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">Configuration</h3>
                            <p className="text-sm text-muted-foreground">Detailed instruction for AI Behaviour</p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="instruction"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Detailed Instruction</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="bg-background resize-none"
                                        disabled={isLoading}
                                        rows={7}
                                        placeholder="Provide detailed instructions on how the AI mentor should interact with the child, including the subject matter and the manner of assistance."
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Give a detailed instruction of who the character is and which subject in what ways will be assisting your kid.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="seed"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Example Conversation</FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="bg-background resize-none"
                                        disabled={isLoading}
                                        rows={7}
                                        placeholder="Provide an example conversation demonstrating how the AI mentor should resolve queries and assist the child in learning."
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Give a detailed conversation example of how you wish the doubts of your kid should be resolved by the AI guide.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit the mentor" : "Create the mentor"}
                        </Button>
                        <Wand2 className="w-4 h-4 ml-2" />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CompanionForms;
