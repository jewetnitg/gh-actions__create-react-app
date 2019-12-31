import * as core from "@actions/core";
import { execSync } from "child_process";

async function run(): Promise<void> {
    try {
        const name = core.getInput("name");
        const template = core.getInput("template");
        const useNpm = core.getInput("useNpm");
        const usePnp = core.getInput("usePnp");
        const scriptsVersion = core.getInput("scriptsVersion");

        const args = [
            name,
            useNpm && "--use-npm",
            usePnp && "--use-pnp",
            scriptsVersion && `--scripts-version ${scriptsVersion}`,
            template && `--template ${template}`,
        ].filter(Boolean);

        execSync(`npx create-react-app ${args.join(" ")}`);
        execSync(`cp -R ${name}/* .`);
        execSync(`rm -rf ${name}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
