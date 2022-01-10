window.onload = () => {
  /*
var colorNames = [
        {red:[123,133,200]},
        {blue:[120,45,100]}
        ];
*/

  var app = new Vue({
    el: "#app",
    data: {
      red: 0,
      green: 0,
      blue: 0,
      step: 16,

      checkStatus: {
        red: true,
        green: true,
        blue: true,
      },
      colorData: null,
      closestColorData: null,
      colors: ["red", "green", "blue"],

      //cn:colorNames
    },
    mounted() {
      this.generateRandomColor();
    },
    methods: {
      getColor: function (color) {
        if (color === "red") return this.red;
        if (color === "green") return this.green;
        if (color === "blue") return this.blue;
      },
      getRGB() {
        let rgb = `${this.red},${this.green},${this.blue}`;
        fetch(`https://www.thecolorapi.com/id?rgb=${rgb}`)
          .then((response) => response.json())
          .then((data) => {
            this.colorData = data;
            fetch(
              `https://www.thecolorapi.com/id?hex=${this.colorData.name.closest_named_hex.slice(
                1
              )}`
            )
              .then((res) => res.json())
              .then((res) => {
                this.closestColorData = res;
              });
          });
        return rgb;
      },
      getBG: function (color) {
        if (color === "red")
          return { background: "rgb(" + this.red + "," + 0 + "," + 0 + ")" };
        if (color === "green")
          return { background: "rgb(" + 0 + "," + this.green + "," + 0 + ")" };
        if (color === "blue")
          return { background: "rgb(" + 0 + "," + 0 + "," + this.blue + ")" };
      },
      setColor(color, ev) {
        let value = +ev.target.value;
        if (value > 255) value = 255;
        if (value < 0) value = 0;
        if (color === "red") this.red = value;
        if (color === "green") this.green = value;
        if (color === "blue") this.blue = value;
        this.getRGB();
      },

      incColor: function (color) {
        if (this[color] + this.step < 256) {
          if (this[color] == 0) this[color] += this.step - 1;
          else this[color] += this.step;
        }
      },
      decColor: function (color) {
        if (this[color] < this.step) this[color] = 0;
        else this[color] -= this.step;
      },
      incAll: function () {
        if (this.red != 255 && this.green != 255 && this.blue != 255) {
        }

        if (this.checkStatus.red) this.incColor("red");

        if (this.checkStatus.blue) this.incColor("blue");

        if (this.checkStatus.green) this.incColor("green");
        this.getRGB();
      },

      decAll: function () {
        if (this.red != 0 && this.green != 0 && this.blue != 0) {
        }
        if (this.checkStatus.red) this.decColor("red");

        if (this.checkStatus.green) this.decColor("green");

        if (this.checkStatus.blue) this.decColor("blue");
        this.getRGB();
      },
      reset: function () {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.step = 16;
        this.checkStatus.red = true;
        this.checkStatus.green = true;
        this.checkStatus.blue = true;
        this.getRGB();
      },
      max: function (next) {
        return next + this.step > 256;
      },
      min: function (next) {
        return next - this.step < -1;
      },

      generateRandomColor: function () {
        let numOfSteps = 256 / this.step + 1;

        if (this.checkStatus.red) {
          let red = Math.floor(Math.random() * numOfSteps) * this.step - 1;
          if (red > -1) this.red = red;
          else this.red = red + 1;
        }

        if (this.checkStatus.green) {
          let green = Math.floor(Math.random() * numOfSteps) * this.step - 1;

          if (green > -1) this.green = green;
          else this.green = green + 1;
        }

        if (this.checkStatus.blue) {
          let blue = Math.floor(Math.random() * numOfSteps) * this.step - 1;

          if (blue > -1) this.blue = blue;
          else this.blue = blue + 1;
        }
        //
        this.getRGB();
      },
    },
  });
};
