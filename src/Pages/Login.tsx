import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground, Button } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AlertModal from '../Components/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    return (
        <ImageBackground
            source={require('../Images/loginbackground.png')} // Optionally add an image background
            style={styles.backgroundImage}
        >
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().required('Required'),
                })}
                onSubmit={async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
                    const storedEmail = await AsyncStorage.getItem('email');
                    const storedPassword = await AsyncStorage.getItem('password');
                    const storedEmailRemember = await AsyncStorage.getItem('emailRemember');

                    if (storedEmail === values.email) {
                        if (storedPassword === values.password) {
                            if (rememberMe) {
                                await AsyncStorage.setItem('emailRemember', values.email);
                                await AsyncStorage.setItem('passwordRemember', values.password);
                            }
                            if (storedEmailRemember === values.email) {
                                setAlertMessage(`Welcome Back ${storedEmail.split('@')[0]}!`);
                            } else {
                                setAlertMessage('Login Successful');
                            }
                            values.email = '';
                            values.password = '';
                        } else {
                            setAlertMessage('Incorrect Password!');
                        }
                    } else {
                        setAlertMessage('Incorrect Email!');
                    }
                    setShowAlert(true);
                    setSubmitting(false);  // Reset submitting state
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, resetForm }) => (
                    <View style={styles.container}>
                        <Text style={styles.title}>Login</Text>
                        <TextInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={styles.input}
                            autoCapitalize="none"
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
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                                <View
                                    style={[
                                        styles.checkbox,
                                        rememberMe ? styles.checkboxChecked : styles.checkboxUnchecked,
                                    ]}
                                >
                                    {rememberMe && <Text style={styles.checkmark}>✔</Text>}
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.text}>Remember Me</Text>
                        </View>
                        <TouchableOpacity onPress={() => { handleSubmit() }} style={styles.button}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                                <Text style={styles.footerLink}>Sing Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
            <AlertModal isVisible={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    passwordStrength: {
        marginBottom: 12,
        fontStyle: 'italic',
        color: 'white',
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14,
        color: 'white',
    },
    footerLink: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    backgroundImage: {
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent overlay for better readability
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#fff',
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
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007BFF',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 3,
        borderWidth: 2,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    checkboxUnchecked: {
        backgroundColor: 'white',
        borderColor: 'gray',
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
        marginTop: -2,
        marginLeft: 2,
    },
    text: {
        fontSize: 16,
        color: '#fff',
    },
});

export default LoginForm;
