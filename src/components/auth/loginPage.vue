<template>
  <div class="white-box-col">
    <Toast />

    <form @submit.prevent="onFormSubmit">
      <div class="white-box">
        <h2 class="title">Sign In</h2>
        <div class="sign-in-box">
          <div class="username-field">
            <InputText
              v-model="form.username"
              type="text"
              placeholder="Username"
              @blur="validateUsername"
              @input="clearUsernameError"
              fluid
            />
            <Message
              v-if="errors.username"
              severity="error"
              size="small"
              variant="simple"
              >{{ errors.username }}</Message
            >
          </div>
          <div class="password-field">
            <Password
              v-model="form.password"
              :feedback="false"
              placeholder="Password"
              @input="validatePassword"
              @focus="markTouched('password')"
              toggleMask
            />
            <div v-if="allRequirementsMet" class="strenght-meter-container">
              <div :class="['strength-meter', strengthClass]">
                <div class="strength-bar" v-for="n in 4" :key="n"></div>
              </div>

              <div class="strength-text">
                {{ strengthText
                }}<span v-tooltip="tooltipText"
                  ><i class="pi pi-info-circle info-icon"></i
                ></span>
              </div>
            </div>
            <Message
              class="error-message"
              v-if="errors.password"
              severity="error"
              size="small"
              variant="simple"
              >{{ errors.password }}</Message
            >
          </div>
          <div class="password-labels">
            <label
              v-show="touched.password"
              class="password-label"
              :class="{ passed: hasUppercase }"
              ><i
                :class="hasUppercase ? 'pi pi-check' : 'pi pi-times'"
                style="font-size: 0.5rem"
              ></i
              >1 uppercase letter</label
            >
            <label
              v-show="touched.password"
              class="password-label"
              :class="{ passed: hasLowerCase }"
              ><i
                :class="hasLowerCase ? 'pi pi-check' : 'pi pi-times'"
                style="font-size: 0.5rem"
              ></i
              >1 lowercase letter</label
            >
            <label
              v-show="touched.password"
              class="password-label"
              :class="{ passed: minLength }"
              ><i :class="minLength ? 'pi pi-check' : 'pi pi-times'"></i>At
              least 8 characters</label
            >
            <label
              v-show="touched.password"
              class="password-label"
              :class="{ passed: hasDigit }"
              ><i
                :class="hasDigit ? 'pi pi-check' : 'pi pi-times'"
                style="font-size: 0.5rem"
              ></i
              >1 digit</label
            >
            <label
              v-show="touched.password"
              class="password-label"
              :class="{ passed: hasSpecialChar }"
              ><i
                :class="hasSpecialChar ? 'pi pi-check' : 'pi pi-times'"
                style="font-size: 0.5rem"
              ></i
              >1 special character</label
            >
          </div>
          <div class="btns-box">
            <Button
              class="button"
              type="submit"
              severity="secondary"
              label="Submit"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import { mostCommonPasswords } from "../../utils/mostCommonPasswords.ts";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";
import "primeicons/primeicons.css";

const toast = useToast();

const router = useRouter();

const form = ref({
  username: "",
  password: "",
});
const errors = reactive({
  username: null,
  password: null,
});

const touched = ref({
  username: false,
  password: false,
});

const minLength = computed(() => form.value.password.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(form.value.password));
const hasLowerCase = computed(() => /[a-z]/.test(form.value.password));
const hasDigit = computed(() => /\d/.test(form.value.password));
const hasSpecialChar = computed(() => /[^a-zA-Z0-9]/.test(form.value.password));

/**
 * If all the requirements are met the strength metter appears and the error messages disapears
 */
const allRequirementsMet = computed(() => {
  return (
    minLength.value &&
    hasUppercase.value &&
    hasLowerCase.value &&
    hasDigit.value &&
    hasSpecialChar.value
  );
});

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .nonempty("Username is required"),
  password: z
    .string()
    .min(8, "Please create a password that meets all requirements below")
    .regex(
      /[A-Z]/,
      "Please create a password that meets all requirements below"
    )
    .regex(
      /[a-z]/,
      "Please create a password that meets all requirements below"
    )
    .regex(
      /[^a-zA-Z0-9]/,
      "Please create a password that meets all requirements below"
    )

    .regex(/\d/, "Please create a password that meets all requirements below")
    .nonempty("Password is required"),
});

const validatePassword = () => {
  try {
    schema.parse(form.value);
    errors.password = null;
    errors.username = null;
  } catch (error) {
    if (error.errors) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    }
  }
};
const clearUsernameError = () => {
  if (!touched.value.username) return;
  errors.username = null;
};

const validateUsername = () => {
  touched.value.username = true;
  try {
    schema.shape.username.parse(form.value.username);
    errors.username = null;
  } catch (error) {
    errors.username = error.errors[0]?.message || "Invalid username";
  }
};

/* 
This function calculates strength based on multiple factors:
1. If the password has more than 9 letters 
2. If the password has more than 1 uppercase
3. If the password has more than 4 lowercase letters
4. If the passsword has more than 2 digits in it
5. If the password has more than 2 special chars
NOTE: If the password appears in one of the most common passwords 
the strength is automatically set to the weakest
*/
const strengthLevel = computed(() => {
  const length = form.value.password.length >= 9;
  const uppercase = (form.value.password.match(/[A-Z]/g) || []).length > 1;
  const lowercase = (form.value.password.match(/[a-z]/g) || []).length > 4;
  const number = (form.value.password.match(/\d/g) || []).length >= 2;
  const specialChar =
    (form.value.password.match(/[^a-zA-Z0-9]/g) || []).length >= 2;

  let strength = 0;
  if (length) strength++;
  if (uppercase) strength++;
  if (lowercase) strength++;
  if (number) strength++;
  if (specialChar) strength++;

  if (
    mostCommonPasswords.find((entry) => entry.password === form.value.password)
  )
    return 1;

  return strength;
});

const strengthText = computed(() => {
  switch (strengthLevel.value) {
    case 1:
      return "Very weak";
    case 2:
      return "Weak";
    case 3:
      return "So-so";
    case 4:
      return "Good";
    case 5:
      return "Strong";
    default:
      return "";
  }
});

const strengthClass = computed(() => {
  switch (strengthLevel.value) {
    case 1:
      return "very-weak";
    case 2:
      return "weak";
    case 3:
      return "so-so";
    case 4:
      return "good";
    case 5:
      return "strong";
    default:
      return "";
  }
});

// this functions searches if the password is in the mostCommonPasswords file and makes the password automatically the weakest
const commonPassword = computed(() => {
  return mostCommonPasswords.find(
    (entry) => entry.password === form.value.password
  );
});

/**
 * Depending on the password strength a tooltip text is chosen
 * and displayed to the user so he can see what needs to change
 */
const tooltipText = computed(() => {
  if (commonPassword.value) {
    const { rank, timeToHack, appearances } = commonPassword.value;
    return `This password is very common (#${rank} most common in the world). The time to hack it is ${timeToHack} and it appears ${appearances} times.`;
  }
  switch (strengthClass.value) {
    case "very-weak":
      return "Your password is very weak. Consider using a longer password with a mix of characters, numbers, and symbols.";
    case "weak":
      return "Your password is weak. Adding uppercase letters, numbers, and special characters would make it stronger.";
    case "so-so":
      return "Your password strength is so-so. A few improvements, like additional special characters, could enhance its security.";
    case "good":
      return "Your password is good! Adding more unique characters would make it even stronger.";
    case "strong":
      return "Great! Your password is strong and meets all security requirements.";
    default:
      return "Not a good password, please be aware of this and change it :)";
  }
});

const markTouched = (field) => {
  touched.value[field] = true;
};

/**
 * When the form is submitted i make a check with zod validator and show a toast message
 * Also the user is redirected to the stories list component and
 * in the localstorage its saved that he is logged in
 */
const onFormSubmit = () => {
  errors.password = null;
  errors.username = null;
  try {
    schema.parse(form.value);
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
    localStorage.setItem("isLoggedIn", "true");
    router.push("/home");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Please fix the errors in the form.",
      life: 3000,
    });
    if (error.errors) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    }
  }
};
</script>

<style scoped>
.white-box-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
.white-box {
  width: 400px;
  padding: 40px;
  border-radius: 15px;
  border: 1px solid #048995;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
.sign-in-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  align-items: center;
}
.title {
  color: #000;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 3rem;
}
.btns-box {
  width: 100%;
  margin-top: 140px;
}
.button {
  width: 100% !important;
  padding: 10px !important;
  background-color: #048995 !important;
  color: #fff !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
}
.button:hover {
  background-color: #154549 !important;
  width: 100% !important;
  padding: 10px !important;
  color: #fff !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
}
.password-field {
  width: 100% !important;
  display: flex;
  flex-direction: column;
}
.username-field {
  width: 100% !important;
}
.error-message {
  color: red;
  font-size: 0.275rem;
  margin-top: 0.25rem;
  text-align: start;
}

.p-password {
  width: 100% !important;
}
.p-password.p-inputtext {
  width: 100% !important;
}
.password-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
  height: 20px;
  width: 100%;
}

.password-label {
  display: flex;
  align-items: center;
  background-color: #e0e7eb;
  color: #4a4a4a;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 0.875rem;
  border: 1px solid #d1d5da;
  gap: 5px;
  height: fit-content;
  color: #c0392b;
}

.password-label i {
  font-size: 0.5rem;
}
.password-label.passed {
  color: #27ae60;
  border-color: #27ae60;
}
::v-deep .p-inputtext {
  width: 100% !important;
}
::v-deep .p-message-text {
  font-size: 0.2rem;
}

.strength-meter {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}
.strength-bar {
  flex: 1;
  height: 4px;
  background-color: #ddd;
  transition: background-color 0.3s;
}
.very-weak .strength-bar:nth-child(1) {
  background-color: red;
}
.weak .strength-bar:nth-child(-n + 2) {
  background-color: orange;
}
.so-so .strength-bar:nth-child(-n + 3) {
  background-color: yellow;
}
.good .strength-bar:nth-child(-n + 4) {
  background-color: lightgreen;
}
.strong .strength-bar:nth-child(-n + 5) {
  background-color: green;
}

.strength-text {
  font-size: 0.875rem;
  color: #555;
  margin-top: 2px;
  text-align: end;
}
.info-icon {
  font-size: 0.8rem;
  margin-left: 0.2rem;
}
</style>
