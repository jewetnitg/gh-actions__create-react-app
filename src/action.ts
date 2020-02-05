import { ActionBuilder, boolean, string } from "@gh-actions/helpers";

interface Inputs {
    // default is repository name
    name?: string;
    // default: true
    useNpm?: boolean;
    // default: false
    usePnp?: boolean;
    // default: undefined
    scriptsVersion?: string;
    // default: "typescript"
    template?: string;
}

const defaultName = process.env.GITHUB_REPOSITORY?.split("/").pop();

const action = ActionBuilder<Inputs>()
    .input("name", string(defaultName))
    .input("template", string("typescript"))
    .input("useNpm", boolean(true))
    .input("usePnp", boolean(false))
    .input("scriptsVersion", string())
    .step("chore: initial commit", async ({ exec, execa }, inputs) => {
        const { name, scriptsVersion, template, useNpm, usePnp } = inputs;
        const args = [
            name,
            useNpm && "--use-npm",
            usePnp && "--use-pnp",
            scriptsVersion && `--scripts-version ${scriptsVersion}`,
            template && `--template ${template}`,
        ].filter(Boolean) as string[];

        await execa(`npx`, ["create-react-app", ...args]);
        await exec(`cp -a ${name}/. .`);
        // TODO move removing github workflows to somewhere more generic,
        //  removing this isn't part of create-react-app, but of the whole
        //  process of setting up a repository using workflows
        await exec(`rm -rf ${name} .github/workflows`);
    })
    .build();

export default action;
