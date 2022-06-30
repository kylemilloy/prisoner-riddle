# Proof for the 100 Prisoner Riddle

Based on [Veritasium's video](https://www.youtube.com/watch?v=iSNsgj1OCLA)

# Usage

```js
git clone https://github.com/kylemilloy/prisoner-riddle

cd prisoner-riddle
npm install
npm start
```

You may modify the experiment's parameters by passing different values in the command-line such as:

- `--choices`: The number of choices each prisoner gets to select their number
- `--prisoners`: The number of prisoners in the experiment
- `--iterations`: The number of times to run the experiment

Some examples of this usage are:

```
npm start --choices=99
npm start --choices=2 --prisoners=1
npm start --iterations=10000
npm start --iterations=10 --choices=10 --prisoners=25
```
