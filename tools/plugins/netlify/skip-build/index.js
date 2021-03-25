const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = {
  onPreBuild: async (props) => {
    const { utils } = props;
    const project = process.env.PROJECT_NAME;
    const lastDeploy = process.env.CACHED_COMMIT_REF;
    const projectHasChanged = await hasProjectChanged(project, lastDeploy);
    if (!projectHasChanged) {
      utils.build.cancelBuild(
        `Build was cancelled because ${project} was not affected by the latest changes`
      );
    }
  },
};

async function hasProjectChanged(project, lastDeploy) {
  const {
    stdout,
  } = await exec(
    `yarn --silent nx print-affected --base=${lastDeploy} --head=HEAD`,
    { encoding: "utf8" }
  );
  const { projects } = JSON.parse(stdout);
  return projects.includes(project);
}
