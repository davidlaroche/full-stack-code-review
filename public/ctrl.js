function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let loginForm = document.getElementById("form");
  let email = document.getElementById("email");
  let file = document.getElementById("file");
  let submitBtn = document.getElementById("submit-btn");
  let successMsg = document.getElementById("success-msg");
  let errorMsg = document.getElementById("error-msg");

  // Set the form action
  loginForm.action = location.href;

  loginForm.addEventListener("submit", async (e) => {
    // Reset msg
    successMsg.style.display = "none";
    errorMsg.style.display = "none";
    e.preventDefault();

    if (!validateEmail(email.value)) {
      email.value = "";
      errorMsg.innerText += "provide a valid email and file";
      errorMsg.style.display = "block";
    } else if (!validateEmail(email.value) || !file.files.length) {
      errorMsg.innerText += "provide a valid CSV file";
      errorMsg.style.display = "block";
    } else {
      submitBtn.setAttribute("disabled", true);
      // Send Data
      const url = new URL(loginForm.action);
      const formData = new FormData(loginForm);
      formData.append("email", email.value);
      formData.append("file", file.files[0]);
      const fetchOptions = {
        method: loginForm.method,
        body: formData,
      };
      try {
        const resp = await fetch(url, fetchOptions);
        const data = await resp.json();
        console.log("🎉", data);
        submitBtn.innerText = "🎉 Thank you!";
      } catch (e) {
        console.log("e", e);
      } finally {
        submitBtn.setAttribute("disabled", false);
      }
    }
  });
});
