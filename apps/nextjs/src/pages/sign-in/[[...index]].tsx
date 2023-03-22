import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <main className="to-[[hsl(280,100%,70%)] flex h-screen flex-col items-center bg-gradient-to-b from-[#6615d7]  text-white">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Sign In
        </h1>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </div>
  </main>
);

export default SignInPage;
