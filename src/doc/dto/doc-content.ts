export class DocContentDto {
  question: string;
  answer: string;
  description: string;
}

export class DocContentMultiDto {
  contents: DocContentDto[];
}
