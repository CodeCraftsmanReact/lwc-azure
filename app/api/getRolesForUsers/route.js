import { NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY,
});

const DATABASE_ID = "azure-logging";
const CONTAINER_ID = "UserRoles";

export async function POST(request) {
  try {
    const body = await request.json();
    const { claims } = body;

    if (!claims || !Array.isArray(claims)) {
      return NextResponse.json(
        { message: "Invalid claims format" },
        { status: 400 }
      );
    }

    const email = claims.email;
    const database = client.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);

    const querySpec = {
      query: "SELECT c.roles FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const roles = resources.length > 0 ? resources[0].roles : ["anonymous"];

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
