import React, { useRef, useState } from "react";
import { StyleSheet, View, Button, Image } from "react-native";
import { WebView } from "react-native-webview";
import { captureRef } from "react-native-view-shot";

const HtmlContentScreen = ({ route }) => {
  const webViewRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  // Your HTML content as a string
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

  const convertHtmlToImage = async () => {
    try {
      const uri = await captureRef(webViewRef, {
        format: "jpg",
        quality: 1,
      });
      setImageUri(uri);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* WebView to render HTML content */}
      <View style={styles.webViewContainer} ref={webViewRef}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webView}
        />
      </View>

      <Button title="Convert to Image" onPress={convertHtmlToImage} />

      {/* Display the generated image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webViewContainer: {
    width: "100%",
    height: "70%", // Adjust height as needed
  },
  webView: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

export default HtmlContentScreen;
