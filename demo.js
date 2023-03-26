const inq = require('inquirer');

// get the orignal array from
const opts = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Finance' },
    { id: 3, name: 'Legal' },
    { id: 4, name: 'Sales' }
  ]

const opts2 = opts.map(function(dept) {
    return {
        value: dept.id,
        name: dept.name,
    }
})

inq.prompt([
    {
        message: 'what is your fave food',
        type: 'list',
        name: 'answer',
        choices: opts2
    }
]).then(function(ans) {
    console.log(ans)
})

