read -p "Enter the GIT env to switch to: "  env;

echo "Switching to $env...";

git checkout $env;
if [ $? -eq 0 ]; then
    read -p "Enter the AMPLIFY env to switch to: " env;
    echo "Checking out amplify env - $env";
    amplify env checkout $env;
    if [ $? -eq 0 ]; then
        echo "Done. Checked out $env successfully.";
        exit 0
    fi
else
    echo "git checkout $env failed.";
    exit 1
fi