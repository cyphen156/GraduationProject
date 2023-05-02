import { Modal, View, Text, Button, StyleSheet } from 'react-native';

function JoiningGroup({ visible, onRequestClose, onConfirm, team }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{team.name}에 합류하시겠습니까?</Text>
          <View style={styles.buttonRow}>
            <View style={styles.Yes}>
              <Button title="네" onPress={onConfirm} />
            </View>
            <Button title="아니오" onPress={onRequestClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  buttonRow: {
    flexDirection: 'row',
  },
  Yes: {
    marginRight: 10,
  }
});

export default JoiningGroup;
