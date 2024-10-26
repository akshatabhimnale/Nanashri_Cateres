import React, { useRef,useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import DateTimePicker from "@react-native-community/datetimepicker";

const NanashriCaterersForm = ({ route }) => {
  const { formTitle, pdfTitle } = route.params;
  const [form, setForm] = useState({
    name: "",
    address: "",
    mobileNumber: "+91",
    date: new Date(),
    time: new Date(),
    menuItems: [{ itemName: "" }],
    quantityOfTable: "",
    quantityOfChair: "",
    quantityOfPeople: "",
    totalAmount: "",
  });
  const removeMenuItem = (index) => {
    const updatedItems = form.menuItems.filter((_, idx) => idx !== index);
    setForm({ ...form, menuItems: updatedItems });
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoAsset = Asset.fromModule(require("./assets/logo.png"));
        await logoAsset.downloadAsync();
        const base64Logo = await FileSystem.readAsStringAsync(
          logoAsset.localUri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        setLogoBase64(base64Logo);
      } catch (error) {
        console.error("Error loading logo:", error);
      }
    };

    loadLogo();
  }, []);

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleMenuItemChange = (index, name, value) => {
    const updatedItems = form.menuItems.map((item, idx) =>
      idx === index ? { ...item, [name]: value } : item
    );
    setForm({ ...form, menuItems: updatedItems });
  };

  const validateMobileNumber = (number) => {
    const regex = /^\+91\d{10}$/;
    return regex.test(number);
  };

  const generatePDF = async () => {
    if (!validateMobileNumber(form.mobileNumber)) {
      Alert.alert(
        "Error",
        "Mobile number must start with +91 and be 10 digits long."
      );
      return;
    }

    

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px }
            h1 { text-align: center; color: #ED070A; width:100%;}
            h2 { text-align: center; color: #333; justify-content: center; margin-bottom: 0% }
            p { margin: 5px 0; }
            table { width: 40%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid black; padding: 10px; text-align: left; }
            th { background-color: #ffffff; }
            .footer { position: absolute; bottom: 20px; right: 20px; }
          </style>
        </head>
        <body>
            <h1 style="justify-content:center; color: black; font-weight:400;font-size:20px"> ${pdfTitle}</h1>
            <table style="width: 100%; border-collapse: collapse; border-color:black; border: 1px solid">
            <tr style="display:flex; flex-direction:row; width:100%; border:none;">
              <th style="border-collapse: collapse; border-right:none;"><img src="data:image/png;base64,${logoBase64}" style="height: 100px; width:100px; "/> </th>
              <th style="border-collapse: collapse; border-left:none; align-items:center;margin-left:0px"><h1 style="width:620px">Nanashree Caterers</h1></th>
            </tr>
            <tr>
              <td colspan="2"><h2 style="font-weight:200; font-size: 18px; border-collapse: collapse"><strong>Office:</strong> Shubharambh Colony, Near Jijamata Chowk, Walhekarwadi, Chinchwad, Pune - 411033 <br/><strong> Mobile No:</strong>8668976936</h2></td>
            </tr>
            <tr style="display:flex; flex-direction:row;">
              <td colspan="1" style="width:350px; font-size: 18px;"><p><strong>Name:</strong> ${
                form.name
              }</p>
                <p style="font-size: 18px;"><strong>Address:</strong> ${
                  form.address
                }</p>
                <p style="font-size: 18px;"><strong>Mobile No:</strong> ${
                  form.mobileNumber
                }</p></td>
              <td colspan="1" style="width:368px;">
                <p style="font-size: 18px;"><strong>Date:</strong> ${form.date.toLocaleDateString()}</p>
                <p style="font-size: 18px;"><strong>Time:</strong> ${form.time.toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}</p>
              </td>
            </tr>
</table>
          <div style="display:flex;">
          <table style="height:100%; width:746px; margin-top:-1px;margin-right:-7px">
            <thead>
              <tr>
                <th style="text-align: center; width:20%%; font-size: 15px ">Sr No.</th>
                <th style="text-align: center; width:80%; font-size: 18px; ">Item Name</th>
              </tr>
            </thead>
            <tbody style="justify-content: center;">
              ${form.menuItems
                .map(
                  (item, index) => `
                <tr style="width:100%">
                  <td style="border-bottom: none; border-top: none; line-height:3px; text-align: center; font-size: 18px;width:20%">${
                    index + 1
                  }</td>
                  <td style="border: none;line-height:2px; text-align: center; font-size: 18px; width:80%">${
                    item.itemName
                  }</td>    
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <table style="width:100%; margin-top:-1px; margin-left:0px; border-left:none">
                <thead>
                    <tr>
                        <th style="text-align: center; font-size: 18px">Quantity</th>
                        <th style="text-align: center; font-size: 18px">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center; font-size: 18px; border-left:none;margin-left:10px;">${
                          form.quantityOfPeople
                        }</td>
                        <td style="text-align: center; font-size: 18px; border-left:none;margin-left:0px;">${
                          form.totalAmount
                        } Rs Only</td>
                    </tr>
                </tbody>
          </table>
          </div>
          <table style="width:100%; margin-top:-1px">
                <thead>
                    <tr>
                        <th style="text-align: center; font-size: 18px">Other Items</th>
                        <th style="text-align: center; font-size: 18px">Grand Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: left; width:49%">
                        <h3 style="font-size: 18px; margin-top: 4px">Tables : ${
                          form.quantityOfTable
                        }</h3>
                        <h3 style="font-size: 18px">Chairs : ${
                          form.quantityOfChair
                        }</h3></td>
                        <td style="text-align: center; width:50%; font-size: 18px">${
                          form.totalAmount
                        } Rs Only</td>
                    </tr>
                </tbody>
          </table>
       
        </body>
      </html>
    `;

    try {

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfFileUri = `${FileSystem.documentDirectory}NanashriCaterersReceipt.pdf`;
      await FileSystem.moveAsync({ from: uri, to: pdfFileUri });
      Sharing.shareAsync(pdfFileUri);

      Alert.alert(
        "PDF created",
        "The PDF was successfully created. You can now open, share it."
      );

      const sharePdf = () => {
        Sharing.shareAsync(pdfFileUri);
      };

      Alert.alert(
        "PDF Ready",
        "What would you like to do?",
        [
          {
            text: "Open",
            onPress: () =>
              FileSystem.getContentUriAsync(pdfFileUri).then((uri) =>
                Sharing.shareAsync(uri)
              ),
          },
          { text: "Share", onPress: sharePdf },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while creating the PDF.");
    }
  };

  const addMenuItem = () => {
    if (form.menuItems.length < 50) {
      setForm({
        ...form,
        menuItems: [...form.menuItems, { itemName: "" }],
      });
    } else {
      Alert.alert("Limit Reached", "You can only add up to 50 menu items.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./assets/logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <Text style={styles.subHeader}>{formTitle}</Text>
      <Text style={{ fontWeight: 500 }}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <Text style={{ fontWeight: 500 }}>Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={(text) => handleInputChange("address", text)}
      />
      <Text style={{ fontWeight: 500 }}>Mobile Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number (+91XXXXXXXXXX)"
        keyboardType="numeric"
        value={form.mobileNumber}
        onChangeText={(text) => {
          if (text.length <= 13) {
            handleInputChange("mobileNumber", text);
          }
        }}
      />
      <Text style={{ fontWeight: 500 }}>Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select Date"
          value={form.date.toLocaleDateString()}
          editable={false}
        />
        <Text style={{ fontWeight: 500 }}>Time:</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={form.date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setForm({ ...form, date: selectedDate });
            }
          }}
        />
      )}
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select Time"
          value={form.time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          editable={false}
        />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={form.time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setForm({ ...form, time: selectedTime });
            }
          }}
        />
      )}

      <Text style={styles.sectionHeader}>Menu</Text>
      {form.menuItems.map((item, index) => (
        <View key={index} style={styles.menuItem}>
          <Text style={{ fontWeight: 500 }}>Item {index + 1}:</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={item.itemName}
              onChangeText={(text) =>
                handleMenuItemChange(index, "itemName", text)
              }
            />
            <TouchableOpacity onPress={() => removeMenuItem(index)}>
              <Text style={styles.deleteButton}>✖</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={addMenuItem}>
        <Text style={styles.buttonText}>Add More Menu Item</Text>
      </TouchableOpacity>

      <Text style={{ fontWeight: 500 }}>Quantity of Table:</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantity of Table"
        keyboardType="numeric"
        value={form.quantityOfTable}
        onChangeText={(text) => handleInputChange("quantityOfTable", text)}
      />

      <Text style={{ fontWeight: 500 }}>Quantity of Chair:</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantity of Chair"
        keyboardType="numeric"
        value={form.quantityOfChair}
        onChangeText={(text) => handleInputChange("quantityOfChair", text)}
      />

      <Text style={{ fontWeight: 500 }}>Quantity of People:</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantity of People"
        keyboardType="numeric"
        value={form.quantityOfPeople}
        onChangeText={(text) => handleInputChange("quantityOfPeople", text)}
      />
      <Text style={{ fontWeight: 500 }}>Total Amount:</Text>
      <TextInput
        style={styles.input}
        placeholder="Total Amount"
        keyboardType="numeric"
        value={form.totalAmount}
        onChangeText={(text) => handleInputChange("totalAmount", text)}
      />
      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generate PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#db5c5c",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  subHeader: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    width: "98%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 2,
    marginTop: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#db5c5c",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    color: "red", // Change this to your preferred color
    fontSize: 18,
    marginLeft: -8,
    marginTop: 1,
    border: "1px solid red",
  },
  backButton: {
    backgroundColor: "#db5c5c",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default NanashriCaterersForm;
