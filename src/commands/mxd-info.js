const pkg = require(process.cwd() + '/package.json');

module.exports = async ({ reply }) => {
  reply.send(`${reply.link(pkg.homepage, pkg.name)} v${pkg.version}`);
};
