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

function interest(a, b) {
    return parseFloat(((a / b) * 100).toFixed(2));
}

function listSum(list) {
    let a = list.split("\n").reduce(function (a, b) {
        return (parseInt(a) || 0) + (parseInt(b) || 0);
    }, 0);
    return a;
}


function getStorage(obj) {
    let value = JSON.parse(window.localStorage.hasOwnProperty('prop-' + obj.code) ? window.localStorage['prop-' + obj.code] : "{}");
    obj.name = value['name'] || "";
    obj.ready = value['ready'] || "";
    obj.target = value['target'] || 0;
}

function setStorage(obj) {
    window.localStorage['prop-' + obj.code] = JSON.stringify(obj)
}


Vue.component('property-counter', {
    props: ['start', 'end', 'code', 'name', 'target', 'ready'],
    data: function () {
        return {
            iavailable: this.available,
            iready: this.ready,
            iname: this.name,
            itarget: this.target,
            icode: this.code
        }
    },
    methods: {
        getPayed: function () {
            return listSum(this.iready);
        },
        change: function (e) {
            this.$root.$emit('change', {
                'code': this.icode,
                'ready': this.iready,
                'name': this.iname,
                'target': this.itarget
            });
        }
    },
    computed: {
        payedInterest: function () {
            let a = this.getPayed()
            return interest(a, this.target);
        },
        total: function () {
            return this.getPayed();
        },
    },
    beforeMount() {


        let date1 = new Date(this.start);
        let date2 = new Date(this.end);
        // console.log(date1, date2);
        let calcP = () => {
            console.log(1);
            let current = new Date();
            var totalDifference_In_Time = date2.getTime() - current.getTime();
            var totalDifference_In_Days = Math.floor(totalDifference_In_Time / (1000 * 3600 * 24));
            var difference_In_Time = current.getTime() - date1.getTime();
            var difference_In_Days = Math.floor(difference_In_Time / (1000 * 3600 * 24));

            //To display the final no. of days (result)
            console.log(totalDifference_In_Days, difference_In_Days);
            this.daysLast = totalDifference_In_Days

            let a = new Array(difference_In_Days + totalDifference_In_Days);
            a.fill("x", 0, difference_In_Days)
            a.fill("o", difference_In_Days, totalDifference_In_Days + difference_In_Days)

            this.days = a;
            let total = date2.getTime() - date1.getTime();

            let target = current.getTime() - date1.getTime();
            this.progress = ((target / total) * 100).toFixed(2);
        }
    },
    template: '#property-template'
})


new Vue({
    el: '#vue-app',
    data: {
        days: [],
        reserved: 0,
        properties: [
            {start: "04/23/2025", end: "04/23/2027", code: "p", target: 4.5, ready: "0"},
            {start: "04/23/2025", end: "04/23/2027", code: "f", target: 20, ready: "0"},
            {start: "04/23/2025", end: "04/23/2027", code: "s", target: 80, ready: "0"},
        ],
        daysLast: 0,
        payed: 0,
        progress: 0
    },
    methods: {
        getReady: function () {
            return this.properties.reduce((a, b) => {
                return a + listSum(b.ready);
            }, 0);
        },
        change: function (e) {
            this.reserved = window.localStorage['reserved'] = this.reserved;
        },
        getPayed: function () {
            let a = this.payed.split("\n").reduce(function (a, b) {
                let intA = parseInt(a) || 0;
                let intB = parseInt(b) || 0;
                return intA + intB;
            }, 0)
            return a;
        },
        getReserved: function () {
            return 2;
        },
        getTotal: function () {
            let total = this.properties.reduce((a, b) => {
                return parseInt(a) + parseInt(b.ready);
            }, 0);
            return total;
        },
        getTarget: function () {
            let total = this.properties.reduce((a, b) => {
                return parseInt(a) + parseInt(b.target);
            }, 0);
            return total;
        },
    },
    created() {
        this.$root.$on('change', (obj) => {
            console.log(obj.code);
            this.properties.map( p => {
                if (p.code === obj.code) {
                    p.ready = obj.ready;
                    p.name = obj.name;
                    p.target = obj.target;
                }
            });
            setStorage(obj)
        })
        this.properties.forEach(p => {
            getStorage(p);
        });


    },
    beforeMount() {
        this.reserved = window.localStorage.hasOwnProperty('reserved') ? window.localStorage['reserved'] : "";
        let date1 = new Date("04/23/2025");
        let date2 = new Date("04/23/2027");
        // console.log(date1, date2);
        let calcP = () => {
            console.log(1);
            let current = new Date();
            var totalDifference_In_Time = date2.getTime() - current.getTime();
            var totalDifference_In_Days = Math.floor(totalDifference_In_Time / (1000 * 3600 * 24));
            var difference_In_Time = current.getTime() - date1.getTime();
            var difference_In_Days = Math.floor(difference_In_Time / (1000 * 3600 * 24));

            //To display the final no. of days (result)
            console.log(totalDifference_In_Days, difference_In_Days);
            this.daysLast = totalDifference_In_Days

            let a = new Array(difference_In_Days + totalDifference_In_Days);
            a.fill("x", 0, difference_In_Days)
            a.fill("o", difference_In_Days, totalDifference_In_Days + difference_In_Days)

            this.days = a;
            let total = date2.getTime() - date1.getTime();

            let target = current.getTime() - date1.getTime();
            this.progress = ((target / total) * 100).toFixed(2);
        }

        calcP();
    },
    computed: {
        total: function () {
            let total = this.properties.reduce((a, b) => {
                return parseInt(a) + parseInt(b.ready);
            }, 0);
            return total;
        },
        target: function () {
            let total = this.properties.reduce((a, b) => {
                return parseInt(a) + parseInt(b.target);
            }, 0);
            return total;
        },
        payedInterest: function () {
            let a = this.getReady()
            let p = interest(a, this.target);
            return p;
        },
        reservedInterest: function () {
            let a = listSum(this.reserved);
            let p = interest(a, this.target);
            console.log(p);
            return p;
        },
    }
});
