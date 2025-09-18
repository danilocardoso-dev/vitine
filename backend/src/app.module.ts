import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { LojistasModule } from './lojistas/lojistas.module';

// 👇 importa seus novos módulos aqui
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    AuthModule,
    TenantsModule,
    PrismaModule,
    UsersModule,
    ProdutosModule, // ✅ agora suas rotas de produtos/vitrine sobem
    PedidosModule,
    LojistasModule,  // ✅ rotas de pedidos também
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}