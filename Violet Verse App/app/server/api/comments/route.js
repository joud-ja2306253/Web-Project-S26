// fisrt read the json file -> account. json simce we are working on it 
//------ GET and post 

//in java script js if we want to read a file content we need to FIRST we import 
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// cwd-> current working directory wich is myfinance-api, data->folder , account.json -> the file i want to read from

// SECOND creat a function to help us read the content of the file located in filepath
async function readAccount(){
    const data = await fs.readFile(filePath, "utf-8");    // using readFile to read it will be read as string therefor we need to use parse after to convert it 
    return JSON.parse(data);
}

async function writeAccounts(accountData){
await fs.writeFile(filePath, JSON.stringify(accountData, null, 4))
// null = don’t filter anything ,4 = add 4 spaces → makes JSON pretty and readable
}


// http://localhost:3001/api/accounts

export async function GET(request , {params}) {
    try{

    // this line will split the Url an will put it in map "key: value"
    //    this paer for filtering 
        const {searchParams}= new URL(request.url);
        const type = searchParams.get("type");
        const status = searchParams.get("status");

         const accountData=await readAccount();
        if (!type || !status){
                    /*only type → ❌ returns all
                    only status → ❌ returns all
                    both → ✅ filters*/
            return NextResponse.json(accountData);
        }

        const filteredAccounts = accountData.filter(a=> 
            a.type==type && a.status==status
        )
            return NextResponse.json(filteredAccounts);
//   // this paer us enough to get the data S
//     const accounts = await readAccount();
//     return NextResponse.json(accounts);
   
    }
    catch(error){return NextResponse.json({error:error.message},{status: 500})}

    /*try 
    http://localhost:3001/api/accounts?type=checking&status=closed
    */
}

//===================note ===============================
// it is BETTER TO HAVE TRY CATCH


export async function POST(request) {
      // get new account from the users  
      // in case of the post this line will return one data not an array
    const body = await request.json();

    
    // Validate the account object here
    // It checks if required fields (name, type, balance) are missing,
     // and if so, returns a 400 error response.
    if (!body.name || !body.type || body.balance === undefined) {
        return NextResponse.json(
            { error: "name, type, and balance are required" },
            { status: 400 }
        );
    }

     // we will read the accounts 
     // the whole array
    const accounts = await readAccount();

    // Auto-increment ID
    const newAccount = {
        id: Math.max(...accounts.map(a => a.id), 0) + 1,
        name: body.name,
        type: body.type,
        balance: Number(body.balance),
        status: "active"
    };
 // then add it to the list af accounts 
    accounts.push(newAccount);
      // i write back the new account 
    await writeAccounts(accounts);

    return NextResponse.json(newAccount, { status: 201 });
}










/* to try this method in post man 
change it to post 
go to body 
go to raw past whatere u want as :
    {
        "id": 110,
        "name": "Main Checking two ",
        "type": "checking",
        "balance": 10000.5,
        "status": "active"
    }

*/


// if i used the POST in the lab then when i send data i dont send id it generates it 



/*
this is teh normal get while the one uo in the query param 
export async function GET(request , {params}) {
    try{
    //return all accounts 
    const accountData=await readAccount();
    return NextResponse.json(accountData);}
    catch(error){return NextResponse.json({error:error.message},{status: 500})}

}*/