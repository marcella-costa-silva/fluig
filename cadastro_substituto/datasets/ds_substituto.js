/**
 * Automatiza a criação de substituto para usuário.
 * @author Marcella Tsangos 
 */
function createDataset(fields, constraints, sortFields) {
	const colleagueId = constraints[0].initialValue
	const replacementId = constraints[1].initialValue
	const validationFinalDate = constraints[2].initialValue
	const validationStartDate = constraints[3].initialValue

	const c1 = DatasetFactory.createConstraint("colleagueId", colleagueId, colleagueId, ConstraintType.MUST)
	const c2 = DatasetFactory.createConstraint("publisherId", replacementId, replacementId, ConstraintType.MUST)
	const c3 = DatasetFactory.createConstraint("validationFinalDate", validationFinalDate, validationFinalDate, ConstraintType.MUST)
	const c4 = DatasetFactory.createConstraint("validationStartDate", validationStartDate, validationStartDate, ConstraintType.MUST)

	const constraints = new Array(c1, c2, c3, c4)

	const dataset = DatasetFactory.getDataset("ds_cria_substituto", null, constraints, null)

	return dataset
}
