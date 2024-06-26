
const {PrismaClient} = require("@prisma/client");

const db= new PrismaClient();
async function main() {

  try {
    await db.category.createMany({
      data :[
        {name :"Famous People"},
        {name :"Movies & TV "},
        {name :"Music"},
        {name :"Games"},
        {name :"Politician"},
        {name :"Animals"},
        {name :"Scientists"},
        {name :"Philosphy"},
      ]
    })
  } catch(error){
    console.error("Error sending default categories",error);

  } finally{
    await db.$disconnect();  }
  
}

main();
