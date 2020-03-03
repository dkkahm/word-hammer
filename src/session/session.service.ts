import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Doc } from 'src/doc/model/doc.entity';
import { Repository, EntityManager } from 'typeorm';
import { Guess } from './model/guess.entity';
import { UpdateGuessDto } from './dto/update-guess.dto';

const FETCH_FACTOR = 10;

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Doc)
    private readonly docRepository: Repository<Doc>,
    @InjectRepository(Guess)
    private readonly guessRepository: Repository<Guess>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getCandiateDocs(count: number): Promise<Doc[]> {
    const fetch_count = count * FETCH_FACTOR;

    let top_fetch_result = await this.entityManager.query(
      `select d.id as docId, ifnull(g.exposeCount, 0) as exposeCount from doc d left join guess g on d.id = g.docId order by exposeCount limit 0, ${fetch_count}`,
    );
    let result = this.choose(top_fetch_result, count);

    const docs: Doc[] = [];
    for (const row of result) {
      const { docId } = row;
      try {
        const doc = await this.docRepository.findOne({ id: docId });
        docs.push(doc);
      } catch (error) {
        console.log(error);
      }
    }

    return docs;
  }

  async updateGuess(updateGuessDto: UpdateGuessDto) {
    const saved_guess = await this.guessRepository.findOne({
      docId: updateGuessDto.docId,
    });

    if (saved_guess) {
      saved_guess.exposeCount++;
      saved_guess.hitCount += updateGuessDto.hit ? 1 : 0;

      return await this.guessRepository.save(saved_guess);
    } else {
      return await this.guessRepository.save({
        userId: 1,
        docId: updateGuessDto.docId,
        exposeCount: 1,
        hitCount: updateGuessDto.hit ? 1 : 0,
      });
    }
  }

  private shuffle(result: any[]) {
    for (let i = 0; i < result.length; ++i) {
      const swap_index = Math.floor(Math.random() * result.length);

      const temp = result[i];
      result[i] = result[swap_index];
      result[swap_index] = temp;
    }

    return result;
  }

  private choose(source: any[], count: number) {
    const result = [];

    for (let i = 0; i < count; ++i) {
      if (source.length === 0) break;

      const pick_index = Math.floor(Math.random() * source.length);
      const pick = source.splice(pick_index, 1);

      result.push(pick[0]);
    }

    return result;
  }
}
