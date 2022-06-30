const clone = require('lodash/clone')
const range = require('lodash/range')
const reduce = require('lodash/reduce')
const remove = require('lodash/remove')
const sample = require('lodash/sample')
const shuffle = require('lodash/shuffle')

/**
 * Change these values to modify the experiment's variables
 */

// the number of boxes each prisoner is allowed to pick
const numberOfChoices = 50

// the number of prisoners that must pass
const numberOfPrisoners = 100

// the number of times to run this experiment
const numberOfIterations = 10000

console.log(`Win rate for random: ${winRate(random, numberOfIterations)}`)
console.log(`Win rate for random: ${winRate(optimal, numberOfIterations)}`)

/**
 * Use an optimal strategy to make prisoner decisions when getting boxes
 * @param {integer} prisoner
 * @param {array} boxes
 * @return boolean
 */
function optimal(prisoner, boxes) {
  // start with the prisoner's number
  let choice = prisoner

  // loop through the number of choices they get
  for (let i = 0; i < numberOfChoices; i++) {
    let result = boxes[choice]

    // if they pick right exit
    if (result === prisoner) {
      return true
    }

    // set their next choice to the result from the box
    choice = result
  }

  // rip
  return false
}

/**
 * Use a random selection algorithm to make prisoner decisions when getting boxes
 * @param {integer} prisoner
 * @param {prisoner} boxes
 * @returns
 */
function random(prisoner, boxes) {
  // get a fresh selection of choices for the prisoner.
  const choices = clone(boxes)

  // loop through the prisoner's choices
  for (let i = 0; i < numberOfChoices; i++) {
    let choice = sample(choices)

    // if they pick right...
    if (choice === prisoner) {
      return true
    }

    // remove the given choice from the available ones
    remove(choices, (box) => box === choice)
  }

  // rip
  return false
}

/**
 * Run the experiment with our given algorithm that decides how to make prisoner choices.
 * @param {callback} algorithm
 * @returns boolean
 */
function experiment(algorithm) {
  // randomize the prisoner numbers into boxes...
  const prisoners = range(0, numberOfPrisoners)
  const boxes = shuffle(prisoners)

  // and check if every prisoner gets through
  return prisoners.every((prisoner) => algorithm(prisoner, boxes))
}

/**
 * Iterate the experiment multiple times and calculate the win rate.
 * @param {callback} algorithm
 * @param {integer} iterations
 * @returns string
 */
function winRate(algorithm, iterations = 1) {
  const wins = reduce(range(0, iterations), (wins) => experiment(algorithm) ? wins += 1 : wins, 0)

  return `${(wins / iterations * 100).toFixed(2)}%`
}
