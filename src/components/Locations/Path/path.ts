var Path = {
  join: (...args: string[]) => {
    return (
      (args[0][0] === "/" ? "/" : "") +
      args
        .map(path => path.split("/").filter(elem => elem.length > 0))
        .reduce((acc, arr) => [...acc, ...arr], [])
        .join("/")
    );
  },
};

export { Path };
