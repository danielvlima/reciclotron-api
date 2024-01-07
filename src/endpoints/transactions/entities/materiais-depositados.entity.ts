import { Material } from 'src/endpoints/materials/entities/material.entity';

export class MateriaisDepositados {
  transacaoId: bigint;
  materialId: bigint;
  quantidade: number;
  valorTotal: number;
  material?: Material;
}
