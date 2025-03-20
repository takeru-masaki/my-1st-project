function doPost(e) {
  // ログ出力（デバッグ用）
  Logger.log("doPostが実行されました");
  Logger.log(e);

  try {
    // スプレッドシートの情報を取得
    // スプレッドシートのURLを指定
    const spreadsheetUrl = "YOUR_SPREADSHEET_URL"; // ここにスプレッドシートのURLを貼り付ける
    const ss = SpreadsheetApp.openByUrl(spreadsheetUrl);

    const sheet = ss.getSheetByName("シート名")

    // 受け取ったデータを取得
    let receivedData;
    if (e.postData && e.postData.contents) {
      // JSON形式のデータを受け取った場合
      receivedData = JSON.parse(e.postData.contents);
    } else if(e.parameter) {
      // URLパラメータ形式でデータを受け取った場合
      receivedData = e.parameter;
    } else {
      throw new Error("No data received in the request.");
    }

    Logger.log("receivedData:");
    Logger.log(receivedData);


    // データをスプレッドシートに出力
    let dataToWrite = [];
    if (typeof receivedData === 'object') {
      if(Array.isArray(receivedData)){
        // 配列の場合
        dataToWrite = receivedData;
      }else{
        // オブジェクトの場合
        dataToWrite = [JSON.stringify(receivedData)];
      }
    } else if(typeof receivedData === 'string' || typeof receivedData === 'number') {
      // 文字列か数値の場合
      dataToWrite = [String(receivedData)];
    }else{
        throw new Error("Unsupported data type received.");
    }
      
    // A列の最終行を取得
    const lastRow = sheet.getLastRow();

    // 次に追加する行番号を計算
    const nextRow = lastRow + 1;

    // スプレッドシートにデータを書き込む
    //dataToWrite.forEach((data, index) => sheet.getRange(nextRow+index,1).setValue(data));
    sheet.getRange(nextRow, 1, dataToWrite.length,1).setValues(dataToWrite.map(d=>[d]));

    // 成功応答を返す
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Data written to spreadsheet." }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // エラー処理
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
