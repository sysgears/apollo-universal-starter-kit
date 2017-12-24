export default function addResolvers(obj) {
  obj = addMutations(obj);

  return obj;
}

function addMutations(obj) {
  obj.Mutation.loginPasswordless = async function(obj, { input: { email } }, context) {
    console.log(email, context);
    return true;
  };

  return obj;
}
