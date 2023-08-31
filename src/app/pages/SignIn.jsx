const SignIn = () => {
  return (
    <div>
      <h1>SignIn</h1>
      <button
        onClick={async () => {
          const response = await fetch("api/test");
          const data = await response.json();
          console.log(
            "🚀 ~ file: SignIn.jsx:8 ~ <buttononClick={async ~ data:",
            data
          );
        }}
      >
        Click me
      </button>
    </div>
  );
};

export default SignIn;
