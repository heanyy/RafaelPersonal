import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { db } from "../firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const InfoScreen = ({ navigation, route }) => {
  const [sex, setSex] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [hora, setHora] = useState("");
  const [peso, setPeso] = useState();
  const [altura, setAltura] = useState();
  const [error, setError] = useState("");

  let user = getAuth().currentUser;
  let userID = user.uid;

  {
    /* Data para os menus dropdown */
  }
  const gender = [
    { key: "Masculino", value: "Masculino" },
    { key: "Feminino", value: "Feminino" },
  ];
  const obje = [
    { key: "Emagrecimento", value: "Emagrecimento" },
    { key: "Ganho muscular", value: "Ganho muscular" },
    { key: "Fisioterapia", value: "Fisioterapia" },
    { key: "Auxiliar", value: "Auxiliar" },
  ];
  const time = [
    { key: "Manhã", value: "Manhã" },
    { key: "Tarde", value: "Tarde" },
    { key: "Noite", value: "Noite" },
  ];

  {
    /* Gambiarra para gerar números para data de peso e altura */
  }
  const pesoNumbers = [];
  for (let i = 30; i <= 220; i++) {
    pesoNumbers.push(i);
  }
  const alturaNumbers = [];
  for (let j = 120; j <= 220; j++) {
    alturaNumbers.push(j);
  }

  {
    /* Função para validar se os campos estão preenchidos */
  }

  const validate = () => {
    if (!sex || !objetivo || !hora || !peso || !altura) {
      //console.log("Erro");
      setError("Preencha todos os campos.");
      return false;
    }
    //console.log("passou");
    return true;
  };

  const firebaseAdd = async () => {
    const database = {
      genero: sex,
      objetivo: objetivo,
      hora: hora,
      peso: peso,
      altura: altura,
      imc: calcIMC(altura, peso),
    };
    await setDoc(doc(db, "users", userID), database, {
      merge: true,
    });
  };

  const calcIMC = (altura, peso) => {
    altura = parseFloat(altura) / 100;
    peso = parseFloat(peso);
    const imc = peso / (altura * altura);
    return imc;
  };

  const handleSave = () => {
    if (validate()) {
      if (calcIMC(altura, peso)) {
        firebaseAdd();
        navigation.navigate("BottomTabNavigator", {
          screen: "Home",
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTxt}>Preencha as informações abaixo.</Text>
      <View>
        <Text style={styles.titleTxt}>Sexo</Text>
        <SelectList
          search={false}
          boxStyles={{ backgroundColor: "#fff" }}
          placeholder="Selecione seu objetivo"
          inputStyles={{ color: "#000" }}
          dropdownTextStyles={{ color: "#fff" }}
          dropdownStyles={{ backgroundColor: "#333333" }}
          value="value"
          data={gender}
          setSelected={(val) => setSex(val)}
        />
      </View>
      <View>
        <Text style={styles.titleTxt}>Objetivo</Text>
        <SelectList
          search={false}
          boxStyles={{ backgroundColor: "#fff" }}
          placeholder="Selecione seu objetivo"
          inputStyles={{ color: "#000" }}
          dropdownTextStyles={{ color: "#fff" }}
          dropdownStyles={{ backgroundColor: "#333333" }}
          value="value"
          data={obje}
          setSelected={(val) => setObjetivo(val)}
        />
      </View>
      <View>
        <Text style={styles.titleTxt}>Horário</Text>
        <SelectList
          search={false}
          boxStyles={{ backgroundColor: "#fff" }}
          placeholder="Selecione seu horário"
          inputStyles={{ color: "#000" }}
          dropdownTextStyles={{ color: "#fff" }}
          dropdownStyles={{ backgroundColor: "#333333" }}
          value="value"
          data={time}
          setSelected={(val) => setHora(val)}
        />
      </View>
      <View>
        <Text style={styles.titleTxt}>Peso</Text>
        <SelectList
          search={false}
          boxStyles={{ backgroundColor: "#fff" }}
          placeholder="Selecione seu peso em KG"
          inputStyles={{ color: "#000" }}
          dropdownTextStyles={{ color: "#fff" }}
          dropdownStyles={{ backgroundColor: "#333333" }}
          value="value"
          data={pesoNumbers}
          setSelected={(val) => setPeso(val)}
        />
      </View>
      <View>
        <Text style={styles.titleTxt}>Altura</Text>
        <SelectList
          search={false}
          boxStyles={{ backgroundColor: "#fff" }}
          placeholder="Selecione sua altura em CM"
          inputStyles={{ color: "#000" }}
          dropdownTextStyles={{ color: "#fff" }}
          dropdownStyles={{ backgroundColor: "#333333" }}
          value="value"
          data={alturaNumbers}
          setSelected={(val) => setAltura(val)}
        />
      </View>
      <Text>{userID}</Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <View style={{ marginTop: 40 }}>
        <TouchableOpacity onPress={handleSave} style={styles.btn}>
          <Text style={styles.txtBtn}>salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default InfoScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  headerTxt: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },
  titleTxt: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    height: 44,
    borderRadius: 10,
    paddingLeft: 20,
  },
  lIcon: {
    position: "absolute",
    right: 18,
    bottom: 10,
  },
  txtBtn: {
    color: "#fff",
    fontSize: 15,
    textTransform: "uppercase",
  },
  btn: {
    width: "100%",
    backgroundColor: "#2562FF",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
