import { afterEach, describe, expect, it, vi } from 'vitest'

//create a project class
class Project {
    constructor() {
        this.project_id = null
        this.project_name = null
        this.client_id = null
        this.project_description = null
        this.start_date = null
        this.end_date = null
        this.status_id = null
        this.category_id = null
        this.created_date = null
    }
}
//mock create project
function mockcreateproject(project) {


    if (project.project_id === 1 && project.project_name === 'project1' && project.client_id === 1 && project.project_description === 'description' && project.start_date === '2021-01-01' && project.end_date === '2021-01-31' && project.status_id === 1 && project.category_id === 1 && project.created_date === '2021-01-01') {
        return true
    } else {
        return false
    }

}

//mock delete project, return message "successfully deleted" if project is deleted
function mockdeleteproject(project_id) {
    if (project_id === 1) {
        return 'successfully deleted'
    }else{
        return 'project not found'
    }
}

//mock update project, return message "successfully updated" if project is updated
function mockupdateproject(project) {
    if (project.project_id === 1 && project.project_name === 'project1' && project.client_id === 1 && project.project_description === 'description' && project.start_date === '2021-01-01' && project.end_date === '2021-01-31' && project.status_id === 1 && project.category_id === 1 && project.created_date === '2021-01-01') {
        return 'successfully updated'
    } else {
        return 'project not found'
    }
}





//mocking the create project function
describe('pretending to create project', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should return true if project is created', () => {
        let project = new Project()
        project.project_id = 1
        project.project_name = 'project1'
        project.client_id = 1
        project.project_description = 'description'
        project.start_date = '2021-01-01'
        project.end_date = '2021-01-31'
        project.status_id = 1
        project.category_id = 1
        project.created_date = '2021-01-01'

        expect(mockcreateproject(project)).toBe(true)
    })

    it('should return false if project is not created', () => {
        let project = new Project()
        project.project_id = 1
        project.project_name = 'project1'
        project.client_id = 2
        project.project_description = 'description'
        project.start_date = '2021-01-01'
        project.end_date = '2021-01-31'
        project.status_id = 1
        project.category_id = 1
        project.created_date = '2021-01-01'

        expect(mockcreateproject(project)).toBe(false)
    })
})


//mocking the delete project function
describe('pretending to delete project', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should return message "successfully deleted" if project is deleted', () => {
        expect(mockdeleteproject(1)).toBe('successfully deleted')
    })

    it('should return message "project not found" if project is not deleted', () => {
        expect(mockdeleteproject(2)).toBe('project not found')
    })
})

//mocking the update project function
describe('pretending to update project', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should return message "successfully updated" if project is updated', () => {
        let project = new Project()
        project.project_id = 1
        project.project_name = 'project1'
        project.client_id = 1
        project.project_description = 'description'
        project.start_date = '2021-01-01'
        project.end_date = '2021-01-31'
        project.status_id = 1
        project.category_id = 1
        project.created_date = '2021-01-01'

        expect(mockupdateproject(project)).toBe('successfully updated')
    })

    it('should return message "project not found" if project is not updated', () => {
        let project = new Project()
        project.project_id = 1
        project.project_name = 'project1'
        project.client_id = 2
        project.project_description = 'description'
        project.start_date = '2021-01-01'
        project.end_date = '2021-01-31'
        project.status_id = 1
        project.category_id = 1
        project.created_date = '2021-01-01'

        expect(mockupdateproject(project)).toBe('project not found')
    })
})


export default mockcreateproject
