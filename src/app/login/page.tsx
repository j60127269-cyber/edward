"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type UserRole } from "@/lib/mock-data";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bgImageError, setBgImageError] = useState(false);
  const router = useRouter();

  // Background image - using Unsplash for a free stock photo of students studying
  // Alternative: Students working on laptops in a classroom/library setting
  const unsplashImageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  const localImageUrl = "/images/login-background.jpg";
  const backgroundImageUrl = bgImageError ? localImageUrl : unsplashImageUrl;
  
  // Preload the background image to check if it loads successfully
  useEffect(() => {
    const img = new Image();
    img.onerror = () => setBgImageError(true);
    img.src = unsplashImageUrl;
  }, [unsplashImageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    try {
      // Try to sign in, which will auto-create if user doesn't exist
      const user = await mockDb.signIn(email, password);
      
      if (user) {
        // Update user role if it was changed
        if (user.role !== selectedRole) {
          await mockDb.updateUser(user.id, { role: selectedRole });
        }
        
        // Redirect to role-specific dashboard
        router.push(`/${selectedRole}`);
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setError("");

    // If email is provided, try to sign in/sign up immediately
    if (email && password) {
      try {
        const user = await mockDb.signIn(email, password);
        if (user) {
          await mockDb.updateUser(user.id, { role });
          router.push(`/${role}`);
        }
      } catch (err) {
        // Continue with form submission
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[#0a0e27]">
      {/* Blurred Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px) brightness(0.4)",
          transform: "scale(1.1)",
        }}
      />
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          {/* Graduation Cap Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/20 p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-heading font-bold text-primary">
              How Academia
            </CardTitle>
            <CardDescription className="text-base font-medium">
              Karibu! Welcome to Uganda&apos;s premier learning platform.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nakato.mary@mak.ac.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <p className="text-sm font-medium text-center text-foreground">
                Continue as:
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant={selectedRole === "student" ? "default" : "outline"}
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => handleRoleSelect("student")}
                >
                  <User className="h-5 w-5" />
                  <span>Continue as Student</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "instructor" ? "default" : "outline"}
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => handleRoleSelect("instructor")}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Continue as Instructor</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "institution" ? "default" : "outline"}
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => handleRoleSelect("institution")}
                >
                  <Building2 className="h-5 w-5" />
                  <span>Continue as Institution</span>
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 h-12 text-base font-semibold" 
              disabled={!selectedRole}
            >
              {selectedRole ? "Sign In / Sign Up" : "Select Role First"}
            </Button>
          </form>
          
          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to How Academia&apos;s Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

