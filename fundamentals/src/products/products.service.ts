// src/products/products.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private ordersService: OrdersService
  ) {}

  findAll() {
    return this.productRepository.find();
  }

  async create(createProductDto: CreateProductDto) {
    console.log('Creating product with data:', createProductDto); // Log the incoming data

    const product = this.productRepository.create(createProductDto);
    const savedProduct= await this.productRepository.save(product);
    console.log('saved Product:', savedProduct)
    return savedProduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({ id, ...updateProductDto });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: {id}
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.remove(product);
  }

  // Example of adding a product to cart

}
