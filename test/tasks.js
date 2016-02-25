module.exports = [{
  watch: {
    paths: '.'
  },
  tasks: [{
    command: 'npm',
    args: ['run', 'nodev']
  }, {
    command: function (a, b) { return console.log(a, b) },
    args: ['1', '2']
  }]
}
]
