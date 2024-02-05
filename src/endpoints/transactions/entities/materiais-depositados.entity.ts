import { Material } from 'src/endpoints/materials/entities/material.entity';

export class MateriaisDepositados {
  transacaoId: bigint;
  materialId: bigint;
  nomeMaterial: string;
  quantidade: number;
  valorTotal: number;
  material?: Material;
}
