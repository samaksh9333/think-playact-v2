<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo-group">
        <img src="@/assets/icon.png" class="auth-logo" alt="Think.Play.Act" />
        <p class="auth-brand">ThinkPlayAct</p>
      </div>
      <h2>{{ isSignup ? "Sign Up" : "Login" }}</h2>
      <form @submit.prevent="handleAuth">
        <input
          v-if="isSignup"
          type="text"
          v-model="firstName"
          placeholder="First Name"
          required
          pattern="^[A-Za-z]{2,}$"
        />
        <input
          v-if="isSignup"
          type="text"
          v-model="lastName"
          placeholder="Last Name"
          required
          pattern="^[A-Za-z]{2,}$"
        />
        <input type="email" v-model="email" placeholder="Email" required />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        />

        <ul class="password-checklist" v-if="isSignup">
          <li :class="{ valid: passwordCriteria.length }">
            Minimum 8 characters
          </li>
          <li :class="{ valid: passwordCriteria.uppercase }">
            At least one uppercase letter
          </li>
          <li :class="{ valid: passwordCriteria.lowercase }">
            At least one lowercase letter
          </li>
          <li :class="{ valid: passwordCriteria.number }">
            At least one number
          </li>
          <li :class="{ valid: passwordCriteria.symbol }">
            At least one special character
          </li>
        </ul>

        <button type="submit">
          {{ isSignup ? "Create Account" : "Login" }}
        </button>
      </form>

      <p class="toggle-text" @click="toggleMode">
        {{
          isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"
        }}
      </p>

      <div class="divider">or</div>

      <button class="google-btn" @click="signInWithGoogle">
        <img src="@/assets/google-icon.png" class="google-icon" alt="Google" />
        Continue with Google
      </button>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      isSignup: false,
      errorMsg: "",
    };
  },
  computed: {
    passwordCriteria() {
      return {
        length: this.password.length >= 8,
        uppercase: /[A-Z]/.test(this.password),
        lowercase: /[a-z]/.test(this.password),
        number: /\d/.test(this.password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(this.password),
      };
    },
  },
  methods: {
    toggleMode() {
      this.isSignup = !this.isSignup;
      this.errorMsg = "";
    },
    async handleAuth() {
      const auth = getAuth();
      this.errorMsg = "";

      try {
        let userCredential;

        if (this.isSignup) {
          if (!this.firstName || !this.lastName) {
            this.errorMsg = "Please enter your first and last name.";
            return;
          }

          const meetsAll =
            this.passwordCriteria.length &&
            this.passwordCriteria.uppercase &&
            this.passwordCriteria.lowercase &&
            this.passwordCriteria.number &&
            this.passwordCriteria.symbol;

          if (!meetsAll) {
            this.errorMsg = "Password must meet all complexity requirements.";
            return;
          }

          userCredential = await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );
        } else {
          userCredential = await signInWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );
        }

        // ✅ Save to localStorage
        localStorage.setItem("parentEmail", userCredential.user.email);
        this.$router.push("/tracker");
      } catch (error) {
        this.errorMsg = this.formatError(error.code);
      }
    },

    async signInWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        localStorage.setItem("parentEmail", result.user.email);
        this.$router.push("/tracker");
      } catch (error) {
        this.errorMsg = this.formatError(error.code);
      }
    },

    formatError(code) {
      switch (code) {
        case "auth/invalid-email":
          return "Invalid email format.";
        case "auth/user-not-found":
        case "auth/wrong-password":
          return "Incorrect email or password.";
        case "auth/email-already-in-use":
          return "Email already registered.";
        case "auth/popup-closed-by-user":
          return "Google sign-in was closed.";
        default:
          return "Authentication failed. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fafafa;
}
.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 360px;
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
button {
  background-color: #ec8147;
  color: white;
  font-weight: bold;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  padding: 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  margin: 0 auto;
  width: 85%;
}
.google-icon {
  width: 18px;
  height: 18px;
}
.toggle-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
}
.divider {
  margin: 1rem 0;
  color: #aaa;
  font-size: 0.85rem;
}
.error {
  margin-top: 1rem;
  color: red;
  font-size: 0.9rem;
}
.password-checklist {
  text-align: left;
  font-size: 0.85rem;
  margin: -0.5rem 0 1rem;
  color: #888;
  list-style: none;
  padding-left: 1rem;
}
.password-checklist li {
  margin-bottom: 0.3rem;
}
.password-checklist li.valid {
  color: green;
  font-weight: 600;
}
.auth-logo-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.auth-logo {
  width: 60px;
}
.auth-brand {
  font-weight: 700;
  font-size: 1.2rem;
  margin-top: 0.4rem;
  color: #444;
}
</style>
