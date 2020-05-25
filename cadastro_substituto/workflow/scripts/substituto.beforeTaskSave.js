function beforeTaskSave(colleagueId, nextSequenceId, userList) {
  var nm_substituido = hAPI.getCardValue('nm_substituido').trim()
  var nm_substituto = hAPI.getCardValue('nm_substituto').trim()
  var dt_inicio = hAPI.getCardValue('dt_inicio').trim()
  var dt_fim = hAPI.getCardValue('dt_fim').trim()

  if (nextSequenceId == 2) {
    var c1 = DatasetFactory.createConstraint("colleagueId", nm_substituido, nm_substituido, ConstraintType.MUST)
    var c2 = DatasetFactory.createConstraint("replacementId", nm_substituto, nm_substituto, ConstraintType.MUST)
    var c3 = DatasetFactory.createConstraint("validationFinalDate", dateFormat(dt_fim), dateFormat(dt_fim), ConstraintType.MUST)
    var c4 = DatasetFactory.createConstraint("validationStartDate", dateFormat(dt_inicio), dateFormat(dt_inicio), ConstraintType.MUST)

    var constraints = new Array(c1, c2, c3, c4)
    var dataset = DatasetFactory.getDataset("ds_substituto", null, constraints, null)
  }
}

/**
 * Recebe no formato "31/01/2020" e retorna "2020-01-31".
 * @param {*} date 
 */
function dateFormat(date) {
  var getDay = date.substring(0, 2)
  var getMount = date.substring(3, 5)
  var getYear = date.substring(6, 10)
  var newDate = getYear + '-' + getMount + '-' + getDay
  return newDate
}
