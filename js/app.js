const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


new Vue({
    el: '#vue-app',
    data: {
        target: 2091000,
        payed: "",
        reserved: "",
        days: [],
        progress: 0
    },
    methods: {
        getPayed: function() {
            let a = this.payed.split("\n").reduce(function(a, b) {
                let intA = parseInt(a) || 0;
                let intB = parseInt(b) || 0;
                return intA + intB;
            }, 0)
            return a;
        },
        getReserved: function() {
            let a = this.reserved.split("\n").reduce(function(a, b) {
                let intA = parseInt(a) || 0;
                let intB = parseInt(b) || 0;
                return intA + intB;
            }, 0);
            return a;
        },
        precent: function(a, b) {
            return ((a / b) * 100).toFixed(2)
        }
    },
    beforeMount() {
        this.reserved = window.localStorage.hasOwnProperty('reserved') ? window.localStorage['reserved'] : "";
        this.payed = window.localStorage.hasOwnProperty('payed') ? window.localStorage['payed'] : "";


        let current = new Date();
        var date1 = new Date("02/07/2023");
        var date2 = new Date("11/01/2023");

        var totalDifference_In_Time = date2.getTime() - current.getTime();
        var totalDifference_In_Days =  Math.floor(totalDifference_In_Time / (1000 * 3600 * 24));
        var difference_In_Time = current.getTime() - date1.getTime();
        var difference_In_Days = Math.floor(difference_In_Time / (1000 * 3600 * 24));

        //To display the final no. of days (result)
        console.log(totalDifference_In_Days, difference_In_Days);

        let a = new Array(difference_In_Days + totalDifference_In_Days-1);
        a.fill("x",0, difference_In_Days )
        a.fill("o", difference_In_Days, totalDifference_In_Days )

        console.log(a);
        this.days = a;
        let total = date2.getTime() - date1.getTime();

        let calcP = ()=>{
            let current = new Date();
            let target =  current.getTime() - date1.getTime();
            this.progress = ((target/total) * 100).toFixed(5);
        }

        calcP();
        setInterval(calcP,1000)
    },
    computed: {
        total: function() {
            let p = this.getPayed();
            let r = this.getReserved();
            console.log(p,r);
            return this.precent(p + r, this.target)+"%";
        },
        payedC: function() {
            window.localStorage['payed'] = this.payed;
            let a = this.getPayed()
            let p = this.precent(a, this.target);
            return p * 5;
        },
        reservedC: function() {
            window.localStorage['reserved'] = this.reserved;
            let a = this.getReserved();

            let p = this.precent(a, this.target);
            return p * 5;
        },
        totalC: function() {
            // this.target
            let p = this.precent(this.target, this.target);
            return p * 5;
        },
    }
});