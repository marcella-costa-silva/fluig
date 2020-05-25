function createDataset(fields, constraints, sortFields) {
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch (e) {
		return processErrorResult(e, constraints);
	}
}

function callService(fields, constraints, sortFields) {
	const serviceData = data();
	const params = serviceData.inputValues;
	const assigns = serviceData.inputAssignments;

	verifyConstraints(serviceData.inputValues, constraints);

	const serviceHelper = ServiceManager.getService(serviceData.fluigService);
	const serviceLocator = serviceHelper.instantiate(serviceData.locatorClass);
	const service = serviceLocator.getColleagueReplacementServicePort();

	params.colleagueReplacement.colleagueId = constraints[0].initialValue // Login do substituído
	params.colleagueReplacement.replacementId = constraints[1].initialValue // Login do substituto
	params.colleagueReplacement.validationFinalDate = constraints[2].initialValue // Data final
	params.colleagueReplacement.validationStartDate = constraints[3].initialValue // Data inicial

	// Chama o serviço passando os parâmetros necessários (inputValues).
	const response = service.createColleagueReplacement(
		getParamValue(params.username, assigns.username),
		getParamValue(params.password, assigns.password),
		getParamValue(params.companyId, assigns.companyId),
		fillColleagueReplacementDto(serviceHelper, params.colleagueReplacement, assigns.colleagueReplacement));

	return response;
}

function defineStructure() {
	addColumn('response');
}

function onSync(lastSyncDate) {
	const serviceData = data();
	const synchronizedDataset = DatasetBuilder.newDataset();

	try {
		const resultDataset = processResult(callService());

		if (resultDataset != null) {
			const values = resultDataset.getValues();

			for (const i = 0; i < values.length; i++) {
				synchronizedDataset.addRow(values[i]);
			}
		}
	} catch (e) {
		log.info('Dataset synchronization error : ' + e.message);

	}
	return synchronizedDataset;
}

function verifyConstraints(params, constraints) {
	if (constraints != null) {
		for (const i = 0; i < constraints.length; i++) {
			try {
				params[constraints[i].fieldName] = JSON.parse(constraints[i].initialValue);
			} catch (e) {
				params[constraints[i].fieldName] = constraints[i].initialValue;
			}
		}
	}
}

function processResult(result) {
	const dataset = DatasetBuilder.newDataset();
	dataset.addColumn("response");
	dataset.addRow([result]);
	return dataset;
}

function processErrorResult(error, constraints) {
	const dataset = DatasetBuilder.newDataset();
	const params = data().inputValues;

	verifyConstraints(params, constraints);

	dataset.addColumn('error');
	dataset.addColumn('password');
	dataset.addColumn('companyId');
	dataset.addColumn('colleagueReplacement');
	dataset.addColumn('username');

	const password = isPrimitive(params.password) ? params.password : JSONUtil.toJSON(params.password);
	const companyId = isPrimitive(params.companyId) ? params.companyId : JSONUtil.toJSON(params.companyId);
	const colleagueReplacement = isPrimitive(params.colleagueReplacement) ? params.colleagueReplacement : JSONUtil.toJSON(params.colleagueReplacement);
	const username = isPrimitive(params.username) ? params.username : JSONUtil.toJSON(params.username);

	dataset.addRow([error.message, password, companyId, colleagueReplacement, username]);

	return dataset;
}

function getParamValue(param, assignment) {
	if (assignment == 'constIABLE') 
		return getValue(param);
	else if (assignment == 'NULL') 
		return null;
	
	return param;
}

function hasValue(value) {
	return value !== null && value !== undefined;
}

function isPrimitive(value) {
	return ((typeof value === 'string') || value.substring !== undefined) || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined';
}

function fillColleagueReplacementDto(serviceHelper, params, assigns) {
	if (params == null) 
		return null;

	const result = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueReplacementDto");

	const colleagueId = getParamValue(params.colleagueId, assigns.colleagueId);
	if (hasValue(colleagueId)) result.setColleagueId(colleagueId);

	const companyId = getParamValue(params.companyId, assigns.companyId);
	if (hasValue(companyId)) result.setCompanyId(companyId);

	const replacementId = getParamValue(params.replacementId, assigns.replacementId);
	if (hasValue(replacementId)) result.setReplacementId(replacementId);

	const validationFinalDate = serviceHelper.getDate(getParamValue(params.validationFinalDate, assigns.validationFinalDate));
	if (hasValue(validationFinalDate)) result.setValidationFinalDate(validationFinalDate);

	const validationStartDate = serviceHelper.getDate(getParamValue(params.validationStartDate, assigns.validationStartDate));
	if (hasValue(validationStartDate)) result.setValidationStartDate(validationStartDate);

	const viewGEDTasks = getParamValue(params.viewGEDTasks, assigns.viewGEDTasks);
	if (hasValue(viewGEDTasks)) result.setViewGEDTasks(viewGEDTasks);

	const viewWorkflowTasks = getParamValue(params.viewWorkflowTasks, assigns.viewWorkflowTasks);
	if (hasValue(viewWorkflowTasks)) result.setViewWorkflowTasks(viewWorkflowTasks);

	return result;
}

function getObjectFactory(serviceHelper) {
	const objectFactory = serviceHelper.instantiate("com.totvs.technology.ecm.foundation.ws.ObjectFactory");
	return objectFactory;
}

function data() {
	return {
		"fluigService": "ECMColleagueReplacementService",
		"operation": "createColleagueReplacement",
		"soapService": "ECMColleagueReplacementServiceService",
		"portType": "ColleagueReplacementService",
		"locatorClass": "com.totvs.technology.ecm.foundation.ws.ECMColleagueReplacementServiceService",
		"portTypeMethod": "getColleagueReplacementServicePort",
		"parameters": [],
		"inputValues": {
			"password": "academy.aluno", // Senha do administrador
			"companyId": 1,
			"colleagueReplacement": {
				"colleagueId": "academy.aluno", // Login do substituído
				"companyId": 1,
				"replacementId": "substituto", // Login do substituto
				"validationFinalDate": "2020-12-31", // Data final
				"validationStartDate": "2020-05-25", // Data inicial
				"viewGEDTasks": true,
				"viewWorkflowTasks": true
			},
			"username": "academy.aluno" // Login do administrador
		},
		"inputAssignments": {
			"password": "VALUE",
			"companyId": "VALUE",
			"colleagueReplacement": {
				"colleagueId": "VALUE",
				"companyId": "VALUE",
				"replacementId": "VALUE",
				"validationFinalDate": "VALUE",
				"validationStartDate": "VALUE",
				"viewGEDTasks": "VALUE",
				"viewWorkflowTasks": "VALUE"
			},
			"username": "VALUE"
		},
		"outputValues": {},
		"outputAssignments": {},
		"extraParams": {
			"enabled": false
		}
	}
}
