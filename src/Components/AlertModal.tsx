import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface AlertModalProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isVisible, message, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Notification</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <Button title="OK" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

// Styles for better UX
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalMessage: {
        marginVertical: 10,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AlertModal;
