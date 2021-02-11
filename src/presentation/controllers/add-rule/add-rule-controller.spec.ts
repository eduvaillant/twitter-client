import { AddRuleController } from './add-rule-controller'
import { AddRule, AddRuleModel } from '@/domain/usecases/add-rule'
import { RuleModel } from '@/domain/models/rule-model'
import { HttpRequest } from '@/presentation/protocols/http'
import { badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors/missing-param-error'

const makeAddRuleStub = (): AddRule => {
  class AddRulesStub implements AddRule {
    async add (rule: AddRuleModel): Promise<RuleModel> {
      return await Promise.resolve({ id: 'any_id', value: 'any_value', tag: 'any_tag' })
    }
  }
  return new AddRulesStub()
}

const makeFakeRule = (): AddRuleModel => ({
  value: 'any_value'
})

const makeFakeRequest = (body: any): HttpRequest => ({
  body
})

type SutTypes = {
  sut: AddRuleController
  addRuleStub: AddRule
}
const makeSut = (): SutTypes => {
  const addRuleStub = makeAddRuleStub()
  const sut = new AddRuleController(addRuleStub)
  return {
    sut,
    addRuleStub
  }
}

describe('AddRuleController', () => {
  test('should call add rule with correct values', async () => {
    const { sut, addRuleStub } = makeSut()
    const addSpy = jest.spyOn(addRuleStub, 'add')
    await sut.handle(makeFakeRequest(makeFakeRule()))
    expect(addSpy).toBeCalledWith(makeFakeRule())
  })

  test('should return 400 if no value is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest({}))
    expect(response).toEqual(badRequest(new MissingParamError('value')))
  })
})