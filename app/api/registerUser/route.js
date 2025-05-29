import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "UserSignups";
const containerId = "Users";

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { id, email, name, provider } = body;
    if (!id || !email || !name || !provider) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }
    // Check for existing user by ID or email
    const query = {
      query: "SELECT * FROM c WHERE c.id = @id OR c.email = @email",
      parameters: [
        { name: "@id", value: id },
        { name: "@email", value: email },
      ],
    };

    const { resources: existingUsers } = await container.items
      .query(query)
      .fetchAll();

    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 200,
      });
    }

    const userItem = {
      id,
      userId: id,
      email,
      name: name || null,
      provider,
      signupDate: new Date().toISOString(),
    };

    const { resource: createdItem } = await container.items.upsert(userItem);
    return new Response(
      JSON.stringify({ message: "User registered", item: createdItem }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Cosmos DB error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
