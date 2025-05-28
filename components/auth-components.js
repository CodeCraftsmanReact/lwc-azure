import { signIn, signOut } from "@/auth";
export async function SignIn({ provider, ...props }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button {...props}>Sign In</button>
    </form>
  );
}

export async function SignOut(props) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </button>
    </form>
  );
}
