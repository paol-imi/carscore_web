export TF_WORKSPACE=cars-workspace-branch-main
export TF_TOKEN_app_terraform_io=iUrx9rH9eqi0GA.atlasv1.O1CzaA3y8swn3m2a0RnmecukQpQ8z5ye6KziTPNymdAdZTMYVZY6opz9FdfvoWrHMR8
if ! terraform workspace list | grep cars-workspace-branch-main; then echo "maramiao"; fi
