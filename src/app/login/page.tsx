import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

// Form server action for handling login
async function authenticate(formData: FormData) {
  "use server";
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Validate inputs here if needed
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (_err) {
    return { error: "Authentication failed" };
  }

  redirect("/");
}

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-800 justify-center items-center">
        <div className="max-w-md text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Currency Futures Arbitrage Platform</h1>
          <p className="text-primary-100">Monitor implied interest rate differentials and identify arbitrage opportunities.</p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-primary-900 mb-2">Welcome Back</h2>
            <p className="text-neutral-600">Sign in to your account</p>
          </div>
          
          <form action={authenticate} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="peter@example.com"
                className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="password123"
                className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-neutral-500">
            <p>Demo account: peter@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}