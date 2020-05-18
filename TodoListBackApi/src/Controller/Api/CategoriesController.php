<?php

namespace App\Controller\Api;

use App\Repository\CategoriesRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
    /**
     * @Route("/api/categories", name="api_categories_")
     */
class CategoriesController extends AbstractController
{
    /**
     * @Route("/", name="categories")
     */
    public function index(CategoriesRepository $categoriesRepository, SerializerInterface $serializer)
    {
        $categories = $serializer->normalize($categoriesRepository->findAll(), null, ['groups' => 'category']);

        return $this->json([
            'categories' => $categories,
        ]);
    }
}
