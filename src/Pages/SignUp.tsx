import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../Components/AlertModal';

interface FormValues {
  email: string;
  password: string;
}

const SignUpForm: React.FC = () => {
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();

  return (
    <ImageBackground
      source={require('../Images/singupbackground.png')} 
      style={styles.background}
    >
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values: FormValues, { setSubmitting }) => {
          try {
            await AsyncStorage.setItem('email', values.email);
            await AsyncStorage.setItem('password', values.password);
            setAlertMessage('Your email and password have been saved!');
          
          } catch (error) {
            setAlertMessage('Error: Failed to save data');
          } finally {
            setSubmitting(false);
            setShowAlert(true);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>

            <TextInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
              autoCapitalize="none" // Prevents auto-capitalization
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              style={styles.input}
            />
            <Text
              style={[
                styles.passwordStrength,
                {
                  color: checkPasswordStrength(values.password) === 'Weak' ? 'red' : 'green',
                  display: values.password.length > 0 ? 'flex' : 'none',
                },
              ]}
            >
              Password Strength: {checkPasswordStrength(values.password)}
            </Text>
            <TouchableOpacity onPress={()=>{handleSubmit()}} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() =>navigation.navigate('Login')}>
                <Text style={styles.footerLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <AlertModal  isVisible={showAlert} message={alertMessage} onClose={() =>{ setShowAlert(false)
          navigation.navigate('Login')
      }} />
    </ImageBackground>
  );
};

const checkPasswordStrength = (password: string): string => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    if (strongRegex.test(password)) return "Strong";
    return "Weak";
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background to make content readable over the image
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  passwordStrength: {
    marginBottom: 12,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignUpForm;
