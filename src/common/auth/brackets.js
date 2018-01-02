export default function expandBrackets(input) {
  // console.log("expand - enter", input)
  // base case
  if (!input.includes('[')) {
    // console.log("expand - basecase", input)
    return [input];
  }

  // expand brackets
  const lhp = input.indexOf('[');
  const rhp = input.indexOf(']');

  const lhs = input.substring(0, lhp);
  const mids = input.substring(lhp + 1, rhp).split(',');
  const rhs = input.substring(rhp + 1);

  // console.log(input, lhs, mids, rhs)

  // Recursion !
  const rhsExpanded = expandBrackets(rhs);

  // console.log(input, lhs, mids, rhsExpanded)

  let output = [];
  for (let mid of mids) {
    for (let r of rhsExpanded) {
      output.push(`${lhs}${mid}${r}`);
    }
  }

  // console.log("expand - exit", input, output)
  return output;
}
