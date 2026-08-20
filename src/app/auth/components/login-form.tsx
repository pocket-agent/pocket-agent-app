import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation, Trans } from "react-i18next";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
import logo from "@/assets/pocket-agent-logo.png";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const { signInWithGoogleCredential, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSuccess = (credential: string) => {
    try {
      signInWithGoogleCredential(credential);
      const from =
        (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch {
      toast.error("Invalid Google sign-in response");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">
                {t("auth.welcomeBack", "Welcome back")}
              </h1>
              <p className="text-muted-foreground text-balance">
                {t("auth.loginWithGoogleOnly", "Sign in with Google to continue")}
              </p>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(response) => {
                  if (response.credential) {
                    handleGoogleSuccess(response.credential);
                  } else {
                    toast.error("Google sign-in did not return a credential");
                  }
                }}
                onError={() => toast.error("Google sign-in failed")}
                useOneTap={false}
                theme="outline"
                size="large"
                width="320"
                text="signin_with"
                locale="en"
              />
            </div>
            {loading && (
              <p className="text-center text-sm text-muted-foreground">
                {t("common.loading", "Loading")}
              </p>
            )}
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src={logo}
              alt="Pocket Agent"
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground">
        <Trans
          i18nKey="auth.agreementText"
          defaults="By continuing, you agree to our {{termsLink}} and {{privacyLink}}"
          components={{
            termsLink: (
              <a href="#" className="underline underline-offset-4 hover:text-primary" />
            ),
            privacyLink: (
              <a href="#" className="underline underline-offset-4 hover:text-primary" />
            ),
          }}
          values={{
            termsLink: t("auth.termsOfService", "Terms of service"),
            privacyLink: t("auth.privacyPolicy", "Privacy policy"),
          }}
        />
      </div>
    </div>
  );
}
