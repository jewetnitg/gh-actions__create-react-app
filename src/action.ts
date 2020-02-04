import { ActionBuilder } from "./__lib__";

interface Inputs {
    name?: string;
    useNpm?: boolean;
    usePnp?: boolean;
    scriptsVersion?: string;
    template?: string;
}

const string = (defaultValue?: string) => (v: string) => v || defaultValue;
const boolean = (defaultValue?: boolean) => (v: string) =>
    v == null || v === "" ? defaultValue : v === "true" || v === "1";

const action = ActionBuilder<Inputs>()
    .input("name", string(process.env.GITHUB_REPOSITORY?.split("/").pop()))
    .input("template", string("typescript"))
    .input("useNpm", boolean(false))
    .input("usePnp", boolean(false))
    .input("scriptsVersion", string())
    .step("chore: initial commit", async ({ childProcess }, inputs) => {
        const { exec } = childProcess;
        const { name, scriptsVersion, template, useNpm, usePnp } = inputs;
        const args = [
            name,
            useNpm && "--use-npm",
            usePnp && "--use-pnp",
            scriptsVersion && `--scripts-version ${scriptsVersion}`,
            template && `--template ${template}`,
        ].filter(Boolean);

        await exec(`npx create-react-app ${args.join(" ")}`);
        await exec(`cp -a ${name}/. .`);
        // TODO move removing github workflows to somewhere more generic,
        //  removing this isn't part of create-react-app, but of the whole
        //  process of setting up a repository using workflows
        await exec(`rm -rf ${name} .github/workflows`);
    })
    .build();

export default action;
