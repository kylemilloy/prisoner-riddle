const clone = require('lodash/clone')
const range = require('lodash/range')
const reduce = require('lodash/reduce')
const remove = require('lodash/remove')
const sample = require('lodash/sample')
const shuffle = require('lodash/shuffle')

// the number of boxes each prisoner is allowed to pick
const numberOfChoices = process.env.npm_config_choices || process.env.npm_package_config_choices

// the number of prisoners that must pass
const numberOfPrisoners = process.env.npm_config_prisoners || process.env.npm_package_config_prisoners

// the number of times to run this experiment
const numberOfIterations = process.env.npm_config_iterations || process.env.npm_package_config_iterations

console.log(`With ${numberOfChoices} choices, ${numberOfPrisoners} prisoners, and ${numberOfIterations} iterations the win rates are...`)
console.log(`Random: ${winRate(random, numberOfIterations)}`)
console.log(`Loop Strategy: ${winRate(loop, numberOfIterations)}`)

/**
 * Use a loop strategy to make prisoner decisions when getting boxes
 * @param {integer} prisoner
 * @param {array} boxes
 * @return boolean
 */
function loop(prisoner, boxes) {
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
