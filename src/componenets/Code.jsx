export class Code {
  Encode(num) {
    num = num.split("");

    let listNum = [];
    num.map((char) => {
      listNum.push(parseFloat(char));
    });

    let temp = [];
    listNum.map((dig) => {
      dig += 7;
      dig = dig % 10;
      temp.push(dig);
    });

    listNum = temp;

    temp = "";

    temp += listNum[2];
    temp += listNum[1];
    temp += listNum[0];
    temp += listNum[3];

    return temp;
  }

  Decode(num) {
    num = num.split("");

    let listNum = [];

    listNum.push(parseFloat(num[2]));
    listNum.push(parseFloat(num[1]));
    listNum.push(parseFloat(num[0]));
    listNum.push(parseFloat(num[3]));

    let temp = [];
    console.log(listNum);
    listNum.map((dig) => {
      dig -= 7;
      temp.push(dig < 0 ? dig + 10 : dig);
    });
    console.log(temp);
    listNum = temp;

    temp = "";

    listNum.map((dig) => {
      temp += dig;
    });

    return temp;
  }
}
export default Code;
