# Axios service base for TypeScript

A base class for API services using Axios.

## Usage example

Installation:

```bash
npm install axios-service-base-ts
```

Service declaration:

```typescript
import { Result } from 'rusty-result-ts'
import { ApiError, ApiServiceBase } from 'axios-service-base-ts'

export interface Person {
  gender: 'female' | 'male'
  name: {first: string, last: string}
  email: string,
}

export class RandomPersonService extends ApiServiceBase {
  constructor () {
    super('https://randomuser.me/api')
  }

  public async getPerson (gender: 'female' | 'male'): Promise<Result<Person | null, ApiError>> {
    return await this.get(`/?gender=${gender}`)
  }
}

export const randomPersonService = new RandomPersonService()
```

Service usage:

```typescript
import { randomPersonService } from 'src/services/random-person-service'

const result = await randomPersonService.getPerson('female')
if (result.isOk() && result.value != null) {
    const person = result.value
    console.log(`A new person: ${person.name.first} ${person.name.last} - ${person.email}`)
} else if (result.isErr()) {
    console.log('Error:', result.error.errorMessage)
}
```

## Development

- This project is using [pnpm](https://pnpm.io/) as a package manager.
- Run `pnpm install` to install dependencies.
- Run `pnpm test` to run tests once.
- Run `pnpm test:watch` to run tests in watch mode.
- Run `pnpm build` to build the project - this will also run the linter (EsLint).